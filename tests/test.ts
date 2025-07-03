import {CifX} from '../src';

CifX.init();
const driver = CifX.openDriver();
console.log("Version:", driver.version);
console.log("BoardCount:", driver.boardCount);
const board = driver.getBoard(0);
console.log("Board:", board.name);
console.log("ChannelCount:", board.channelCount);
const channel = board.getChannel(0);
channel.open();
channel.ioWrite(0, 0, Buffer.from([0x01, 0x02, 0x03, 0x04]));
console.log("Channel:", channel.ioRead(0, 0, 4));
channel.close();
driver.close();
CifX.deinit();