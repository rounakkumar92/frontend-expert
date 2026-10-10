-- CreateTable
CREATE TABLE "article_views" (
    "id" TEXT NOT NULL,
    "articleSlug" TEXT NOT NULL,
    "articleTitle" TEXT,
    "userId" TEXT,
    "sessionId" TEXT NOT NULL,
    "source" TEXT,
    "fromSlug" TEXT,
    "device" TEXT,
    "readingProgress" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_events" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "resultCount" INTEGER NOT NULL,
    "clickedSlug" TEXT,
    "userId" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discovery_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "fromSlug" TEXT,
    "sessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discovery_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "article_views_articleSlug_createdAt_idx" ON "article_views"("articleSlug", "createdAt");

-- CreateIndex
CREATE INDEX "article_views_sessionId_articleSlug_createdAt_idx" ON "article_views"("sessionId", "articleSlug", "createdAt");

-- CreateIndex
CREATE INDEX "article_views_createdAt_idx" ON "article_views"("createdAt");

-- CreateIndex
CREATE INDEX "article_views_fromSlug_articleSlug_idx" ON "article_views"("fromSlug", "articleSlug");

-- CreateIndex
CREATE INDEX "search_events_query_idx" ON "search_events"("query");

-- CreateIndex
CREATE INDEX "search_events_resultCount_createdAt_idx" ON "search_events"("resultCount", "createdAt");

-- CreateIndex
CREATE INDEX "search_events_createdAt_idx" ON "search_events"("createdAt");

-- CreateIndex
CREATE INDEX "discovery_events_type_target_idx" ON "discovery_events"("type", "target");

-- CreateIndex
CREATE INDEX "discovery_events_createdAt_idx" ON "discovery_events"("createdAt");

-- AddForeignKey
ALTER TABLE "article_views" ADD CONSTRAINT "article_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "search_events" ADD CONSTRAINT "search_events_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
