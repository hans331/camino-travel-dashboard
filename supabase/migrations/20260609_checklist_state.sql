-- Add 4-state status to checklist items: pending | in-progress | attention | completed
-- Replaces the binary `checked` boolean with richer state model.
-- Backfill: checked=true → completed, checked=false → pending.

ALTER TABLE checklist_items ADD COLUMN IF NOT EXISTS state TEXT;

UPDATE checklist_items
SET state = CASE WHEN checked THEN 'completed' ELSE 'pending' END
WHERE state IS NULL;

ALTER TABLE checklist_items ALTER COLUMN state SET DEFAULT 'pending';
ALTER TABLE checklist_items ALTER COLUMN state SET NOT NULL;

-- Optional constraint to enforce valid states
ALTER TABLE checklist_items DROP CONSTRAINT IF EXISTS checklist_items_state_check;
ALTER TABLE checklist_items ADD CONSTRAINT checklist_items_state_check
  CHECK (state IN ('pending', 'in-progress', 'attention', 'completed'));
