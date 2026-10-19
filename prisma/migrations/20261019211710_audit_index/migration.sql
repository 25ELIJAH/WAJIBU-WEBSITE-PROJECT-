-- CreateIndex
CREATE INDEX "AuditLog_action_detail_createdAt_idx" ON "AuditLog"("action", "detail", "createdAt");
