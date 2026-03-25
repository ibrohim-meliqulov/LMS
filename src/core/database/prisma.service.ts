import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        const url = process.env.DATABASE_URL
        const pool = new Pool({ connectionString: url })
        const adapter = new PrismaPg(pool)
        super({
            adapter,
            log: ["error", "warn"]
        })
    }
    async onModuleInit() {
        this.logger.log("Connectin to database")
        await this.$connect()
        this.logger.log("Prisma connected ✅")
    }
    async onModuleDestroy() {
        await this.$disconnect()
        this.logger.log("Prisma disconnected ❌")
    }
}