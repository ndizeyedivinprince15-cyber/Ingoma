-- CreateTable
CREATE TABLE "creatives" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "bio" TEXT,
    "location" TEXT NOT NULL DEFAULT 'Gitega',
    "phone" TEXT,
    "email" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "creatives_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portfolio_items" (
    "id" TEXT NOT NULL,
    "creative_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "media_url" TEXT NOT NULL,
    "media_type" TEXT NOT NULL DEFAULT 'image',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "portfolio_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_requests" (
    "id" TEXT NOT NULL,
    "creative_id" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "client_email" TEXT NOT NULL,
    "client_phone" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "creatives_slug_key" ON "creatives"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "creatives_email_key" ON "creatives"("email");

-- CreateIndex
CREATE INDEX "creatives_domain_idx" ON "creatives"("domain");

-- CreateIndex
CREATE INDEX "creatives_is_active_idx" ON "creatives"("is_active");

-- CreateIndex
CREATE INDEX "portfolio_items_creative_id_idx" ON "portfolio_items"("creative_id");

-- CreateIndex
CREATE INDEX "contact_requests_creative_id_idx" ON "contact_requests"("creative_id");

-- CreateIndex
CREATE INDEX "contact_requests_status_idx" ON "contact_requests"("status");

-- AddForeignKey
ALTER TABLE "portfolio_items" ADD CONSTRAINT "portfolio_items_creative_id_fkey" FOREIGN KEY ("creative_id") REFERENCES "creatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_requests" ADD CONSTRAINT "contact_requests_creative_id_fkey" FOREIGN KEY ("creative_id") REFERENCES "creatives"("id") ON DELETE CASCADE ON UPDATE CASCADE;
