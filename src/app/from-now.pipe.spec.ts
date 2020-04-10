import { FromNowPipe } from './from-now.pipe';

describe('RelativeTimePipe', () => {
  it('create an instance', () => {
    const pipe = new FromNowPipe();
    expect(pipe).toBeTruthy();
  });
});
