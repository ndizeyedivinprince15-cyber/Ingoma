-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "last_login_at" DATETIME
);

-- CreateTable
CREATE TABLE "user_profiles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "age" INTEGER NOT NULL,
    "professional_status" TEXT NOT NULL,
    "family_status" TEXT NOT NULL,
    "children_count" INTEGER NOT NULL DEFAULT 0,
    "annual_income" INTEGER NOT NULL,
    "postal_code" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "housing_type" TEXT NOT NULL,
    "housing_status" TEXT NOT NULL,
    "housing_construction_year" INTEGER,
    "has_renovation_project" BOOLEAN NOT NULL DEFAULT false,
    "has_business_project" BOOLEAN NOT NULL DEFAULT false,
    "is_student" BOOLEAN NOT NULL DEFAULT false,
    "raw_data" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "aids" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "long_description" TEXT,
    "authority" TEXT NOT NULL,
    "geographic_scope" TEXT NOT NULL,
    "geographic_zones" TEXT NOT NULL,
    "eligibility_rules" TEXT NOT NULL,
    "estimation_rules" TEXT,
    "official_link" TEXT,
    "required_documents" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "eligibility_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_profile_id" TEXT NOT NULL,
    "aid_id" TEXT NOT NULL,
    "is_eligible" BOOLEAN NOT NULL,
    "probability_score" REAL NOT NULL,
    "estimated_amount_min" INTEGER,
    "estimated_amount_max" INTEGER,
    "criteria_results" TEXT NOT NULL,
    "explanation" TEXT,
    "evaluated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "eligibility_results_user_profile_id_fkey" FOREIGN KEY ("user_profile_id") REFERENCES "user_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "eligibility_results_aid_id_fkey" FOREIGN KEY ("aid_id") REFERENCES "aids" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "dossiers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "aid_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'BROUILLON',
    "form_data" TEXT NOT NULL,
    "generated_content" TEXT,
    "user_notes" TEXT,
    "submitted_at" DATETIME,
    "external_reference" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "dossiers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "dossiers_aid_id_fkey" FOREIGN KEY ("aid_id") REFERENCES "aids" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "user_profiles_user_id_key" ON "user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "user_profiles_user_id_idx" ON "user_profiles"("user_id");

-- CreateIndex
CREATE INDEX "user_profiles_region_idx" ON "user_profiles"("region");

-- CreateIndex
CREATE INDEX "user_profiles_department_idx" ON "user_profiles"("department");

-- CreateIndex
CREATE UNIQUE INDEX "aids_slug_key" ON "aids"("slug");

-- CreateIndex
CREATE INDEX "aids_category_idx" ON "aids"("category");

-- CreateIndex
CREATE INDEX "aids_is_active_idx" ON "aids"("is_active");

-- CreateIndex
CREATE INDEX "aids_geographic_scope_idx" ON "aids"("geographic_scope");

-- CreateIndex
CREATE INDEX "aids_slug_idx" ON "aids"("slug");

-- CreateIndex
CREATE INDEX "eligibility_results_user_profile_id_idx" ON "eligibility_results"("user_profile_id");

-- CreateIndex
CREATE INDEX "eligibility_results_aid_id_idx" ON "eligibility_results"("aid_id");

-- CreateIndex
CREATE INDEX "eligibility_results_is_eligible_idx" ON "eligibility_results"("is_eligible");

-- CreateIndex
CREATE UNIQUE INDEX "eligibility_results_user_profile_id_aid_id_key" ON "eligibility_results"("user_profile_id", "aid_id");

-- CreateIndex
CREATE INDEX "dossiers_user_id_idx" ON "dossiers"("user_id");

-- CreateIndex
CREATE INDEX "dossiers_aid_id_idx" ON "dossiers"("aid_id");

-- CreateIndex
CREATE INDEX "dossiers_status_idx" ON "dossiers"("status");
