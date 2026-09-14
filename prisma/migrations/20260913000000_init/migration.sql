-- Initial Inevia.shop schema. Generated from prisma/schema.prisma.
-- This enum bootstrap is retained for the original scaffold. Before the first
-- database deployment, regenerate the baseline from the complete multi-store
-- schema with: prisma migrate reset (development) / prisma migrate diff.
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN','ADMIN','STORE_MANAGER','PRODUCT_MANAGER','ORDER_MANAGER','CASHIER','CUSTOMER');
CREATE TYPE "ProductType" AS ENUM ('PHYSICAL','DIGITAL');
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT','ACTIVE','ARCHIVED');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','REFUNDED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING','AUTHORIZED','PAID','FAILED','REFUNDED','CANCELLED');
CREATE TYPE "PaymentMethod" AS ENUM ('STRIPE','MPESA','EMOLA','BANK_TRANSFER','CASH_ON_DELIVERY');
CREATE TYPE "ShipmentStatus" AS ENUM ('PENDING','PREPARING','SHIPPED','IN_TRANSIT','DELIVERED','RETURNED','CANCELLED');
CREATE TYPE "CouponType" AS ENUM ('PERCENTAGE','FIXED','FREE_SHIPPING');
CREATE TYPE "SalesChannel" AS ENUM ('ONLINE','POS','ADMIN','MARKETPLACE');
CREATE TYPE "LocationType" AS ENUM ('STORE','WAREHOUSE','PICKUP_POINT');
CREATE TYPE "CashSessionStatus" AS ENUM ('OPEN','CLOSED','RECONCILED');
CREATE TYPE "CashMovementType" AS ENUM ('OPENING_FLOAT','SALE','REFUND','CASH_IN','CASH_OUT','CLOSING_ADJUSTMENT');
CREATE TYPE "StockMovementType" AS ENUM ('PURCHASE','SALE','RETURN','TRANSFER_IN','TRANSFER_OUT','ADJUSTMENT_IN','ADJUSTMENT_OUT','DAMAGE','RESERVATION','RELEASE');
CREATE TYPE "ReturnStatus" AS ENUM ('REQUESTED','APPROVED','RECEIVED','REFUNDED','REJECTED','CANCELLED');
CREATE TYPE "ReceiptType" AS ENUM ('RECEIPT','INVOICE','CREDIT_NOTE');
-- Apply this migration with `npm run db:migrate`; Prisma keeps the complete,
-- provider-specific DDL in sync with schema.prisma during development.
