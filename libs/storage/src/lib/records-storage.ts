const STORAGE_KEY = 'records';

interface Record {
  id: string;
  startedAt: string;
  selectedTaskId: string | null;
  duration: number; // Duration in seconds
}

type RecordUpdates = Partial<Omit<Record, 'id' | 'startedAt'>>;

// Create: Add a new  record
export function createRecord(
  selectedTaskId: string | null,
  duration: number
): Record {
  const records = readRecords();
  const newRecord: Record = {
    id: crypto.randomUUID(),
    startedAt: new Date(Date.now() - duration * 1000).toISOString(),
    selectedTaskId,
    duration,
  };
  records.push(newRecord);
  saveRecords(records);
  return newRecord;
}

// Read: Get all  records
export function readRecords(): Record[] {
  const recordsJson = localStorage.getItem(STORAGE_KEY);
  return recordsJson ? JSON.parse(recordsJson) : [];
}

// Read: Get a single  record by ID
export function readRecord(id: string): Record | null {
  const records = readRecords();
  return records.find((record) => record.id === id) || null;
}

// Update: Modify an existing  record
export function updateRecord(
  id: string,
  updates: RecordUpdates
): Record | null {
  const records = readRecords();
  const recordIndex = records.findIndex((record) => record.id === id);
  if (recordIndex !== -1) {
    records[recordIndex] = {
      ...records[recordIndex],
      ...updates,
    };
    saveRecords(records);
    return records[recordIndex];
  }
  return null;
}

// Delete: Remove a  record
export function deleteRecord(id: string): boolean {
  const records = readRecords();
  const updatedRecords = records.filter((record) => record.id !== id);
  saveRecords(updatedRecords);
  return updatedRecords.length < records.length;
}

// Helper function to save  records to localStorage
function saveRecords(records: Record[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

// Optionally, you can export the Record interface if it's needed in other files
export type { Record as Record, RecordUpdates as RecordUpdates };
