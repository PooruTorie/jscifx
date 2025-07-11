import {CifX} from '../src';
import {CIFX_RESET} from "../src/impl/Consts";
import {CifXError} from "../src/impl/Errors";

test('Test CifX Driver', () => {
	try {
		CifX.init();
		const driver = CifX.openDriver();
		driver.printSystemInfo();
		console.log("Version:", driver.version);
		console.log("BoardCount:", driver.boardCount);
		const board = driver.getBoard(0);
		console.log("Board:", board.name);
		console.log("ChannelCount:", board.channelCount);
		const channel = board.getChannel(0);
		channel.open();
		channel.reset(CIFX_RESET.CIFX_SYSTEMSTART);
		channel.startHost();
		channel.lockConfig();
		channel.openBus();
		channel.ioWrite(0, 0, Buffer.from([0x01, 0x02, 0x03, 0x04]));
		console.log("Channel:", channel.ioRead(0, 0, 4));
		channel.closeBus();
		channel.unlockConfig();
		channel.stopHost();
		channel.close();
		driver.close();
		CifX.deinit();
	} catch (e) {
		if (e instanceof CifXError) {
			throw Object.assign(new Error(`${e.errorName}: ${e.description}`), {cause: e});
		}
		throw e;
	}
});