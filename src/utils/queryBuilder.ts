import { PaginatedResult, PaginationMeta, QueryParams } from "../interface/query";

class QueryBuilder<T> {
  private where: Record<string, unknown> = {};
  private orderBy: Record<string, "asc" | "desc"> = {};
  private skip = 0;
  private take = 10;
  private page = 1;
  private total = 0;

  constructor(private query: QueryParams) {}

  search(searchableFields: string[]) {
    if (this.query.search) {
      this.where.OR = searchableFields.map((field) => ({
        [field]: { contains: this.query.search, mode: "insensitive" },
      }));
    }
    return this;
  }

  filter(filterableFields: string[]) {
    for (const field of filterableFields) {
      if (this.query[field] !== undefined) {
        this.where[field] = this.query[field];
      }
    }
    return this;
  }

  sort(defaultField = "createdAt", defaultOrder: "asc" | "desc" = "desc") {
    const sortBy = (this.query.sortBy as string) || defaultField;
    const sortOrder = (this.query.sortOrder as "asc" | "desc") || defaultOrder;
    this.orderBy = { [sortBy]: sortOrder };
    return this;
  }

  paginate() {
    this.page = Number(this.query.page) || 1;
    this.take = Number(this.query.limit) || 10;
    this.skip = (this.page - 1) * this.take;
    return this;
  }

  async execute(
    model: {
      findMany: (args: {
        where?: any;
        orderBy?: any;
        skip?: number;
        take?: number;
        select?: any;
      }) => Promise<T[]>;
      count: (args: { where?: any }) => Promise<number>;
    },
    select?: Record<string, boolean>,
  ): Promise<PaginatedResult<T>> {
    const [data, total] = await Promise.all([
      model.findMany({
        where: this.where,
        orderBy: this.orderBy,
        skip: this.skip,
        take: this.take,
        ...(select ? { select } : {}),
      }),
      model.count({ where: this.where }),
    ]);

    this.total = total;

    const meta: PaginationMeta = {
      page: this.page,
      limit: this.take,
      total,
      totalPages: Math.ceil(total / this.take),
    };

    return { data, meta };
  }
}

export default QueryBuilder;