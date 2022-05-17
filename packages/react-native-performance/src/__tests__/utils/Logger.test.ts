import {LogLevel} from '../../utils';
import logger from '../../utils/Logger';

describe('utils/Logger', () => {
  const debugMessage = 'Debug message';

  beforeEach(() => {
    console.debug = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
  });

  it('logs all messages with logLevel = Debug', async () => {
    logger.logLevel = LogLevel.Debug;

    logger.debug(debugMessage);
    expect(console.debug as jest.Mock).toBeCalledWith(debugMessage);

    logger.info(debugMessage);
    expect(console.info as jest.Mock).toBeCalledWith(debugMessage);

    logger.warn(debugMessage);
    expect(console.warn as jest.Mock).toBeCalledWith(debugMessage);

    logger.error(debugMessage);
    expect(console.error as jest.Mock).toBeCalledWith(debugMessage);
  });

  it('logs only Info & Warn & Error messages with logLevel = Info', async () => {
    logger.logLevel = LogLevel.Info;

    logger.debug(debugMessage);
    expect(console.debug as jest.Mock).not.toHaveBeenCalled();

    logger.info(debugMessage);
    expect(console.info as jest.Mock).toBeCalledWith(debugMessage);

    logger.warn(debugMessage);
    expect(console.warn as jest.Mock).toBeCalledWith(debugMessage);

    logger.error(debugMessage);
    expect(console.error as jest.Mock).toBeCalledWith(debugMessage);
  });

  it('logs only Warn & Error messages with logLevel = Warn', async () => {
    logger.logLevel = LogLevel.Warn;

    logger.debug(debugMessage);
    expect(console.debug as jest.Mock).not.toHaveBeenCalled();

    logger.info(debugMessage);
    expect(console.info as jest.Mock).not.toHaveBeenCalled();

    logger.warn(debugMessage);
    expect(console.warn as jest.Mock).toBeCalledWith(debugMessage);

    logger.error(debugMessage);
    expect(console.error as jest.Mock).toBeCalledWith(debugMessage);
  });

  it('logs only Error messages with logLevel = Error', async () => {
    logger.logLevel = LogLevel.Error;

    logger.debug(debugMessage);
    expect(console.debug as jest.Mock).not.toHaveBeenCalled();

    logger.info(debugMessage);
    expect(console.info as jest.Mock).not.toHaveBeenCalled();

    logger.warn(debugMessage);
    expect(console.warn as jest.Mock).not.toHaveBeenCalled();

    logger.error(debugMessage);
    expect(console.error as jest.Mock).toBeCalledWith(debugMessage);
  });
});
