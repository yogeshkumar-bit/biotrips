import { TripStatusPipe } from './trip-status.pipe';

describe('TripStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new TripStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
