export enum FeedFrequency {
  HOURLY = 'Hourly',
  WEEKLY = 'Weekly',
  DAILY = 'Daily',
}

export const FrequencyCronMap = {
  [FeedFrequency.HOURLY]: '0 * * * *',
  [FeedFrequency.DAILY]: '0 0 * * *',
  [FeedFrequency.WEEKLY]: '0 0 * * 0',
};