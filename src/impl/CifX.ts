import {CIFX_LIB, CURRENT_PLATFORM} from "../loader";
import {KoffiFunction} from "koffi";
import * as koffi from "koffi";

export type CifX = {
	init?: KoffiFunction
	deinit?: KoffiFunction
	getVersion?: KoffiFunction
	openDriver: KoffiFunction
	closeDriver: KoffiFunction
	getInfo: KoffiFunction
	getBoard: KoffiFunction
	getChannel: KoffiFunction
	openChannel: KoffiFunction
	closeChannel: KoffiFunction
	ioWrite: KoffiFunction
	ioRead: KoffiFunction
	updateHostState: KoffiFunction
	updateBusState: KoffiFunction
	resetChannel: KoffiFunction
	lockConfig: KoffiFunction
};

export const CIFXHANDLE = koffi.pointer("void");
export type CIFXHANDLE = any[];
export const DRIVER_INFORMATION = koffi.pack("DRIVER_INFORMATION", {
	driverVersion: "char[32]",
	boardCount: "uint32",
});
export type DRIVER_INFORMATION = {
	driverVersion: string,
	boardCount: number,
};
const SYSTEM_INFORMATION = koffi.pack("SYSTEM_INFORMATION", {
	cookie: "uint8[4]",
	ulDpmTotalSize: "uint32",
	ulDeviceNumber: "uint32",
	ulSerialNumber: "uint32",
	ausHwOptions: "uint16[4]",
	usManufacturer: "uint16",
	usProductionDate: "uint16",
	ulLicenseFlags1: "uint32",
	ulLicenseFlags2: "uint32",
	usNetxLicenseID: "uint16",
	usNetxLicenseFlags: "uint16",
	usDeviceClass: "uint16",
	bHwRevision: "uint8",
	bHwCompatibility: "uint8",
	bDevIdNumber: "uint8",
	bReserved: "uint8",
	usReserved: "uint16",
});
export type SYSTEM_INFORMATION = {
	abCookie: [number, number, number, number],
	ulDpmTotalSize: number,
	ulDeviceNumber: number,
	ulSerialNumber: number,
	ausHwOptions: [number, number, number, number],
	usManufacturer: number,
	usProductionDate: number,
	ulLicenseFlags1: number,
	ulLicenseFlags2: number,
	usNetxLicenseID: number,
	usNetxLicenseFlags: number,
	usDeviceClass: number,
	bHwRevision: number,
	bHwCompatibility: number,
	bDevIdNumber: number,
	bReserved: number,
	usReserved: number,
};
export const BOARD_INFORMATION = koffi.pack("BOARD_INFORMATION", {
	error: "int32",
	name: "char[16]",
	alias: "char[16]",
	id: "uint32",
	systemError: "uint32",
	physicalAddress: "uint32",
	interruptNumber: "uint32",
	interruptFlag: "uint8",
	channelCount: "uint32",
	dualPortMemory: "uint32",
	systemInfo: SYSTEM_INFORMATION
});
export type BOARD_INFORMATION = {
	error: number,
	name: string,
	alias: string,
	id: number,
	systemError: number,
	physicalAddress: number,
	interruptNumber: number,
	interruptFlag: number,
	channelCount: number,
	dualPortMemory: number,
	systemInfo: SYSTEM_INFORMATION
};
export const CHANNEL_INFORMATION = koffi.pack("CHANNEL_INFORMATION", {
	abBoardName: "char[16]",
	abBoardAlias: "char[16]",
	ulDeviceNumber: "uint32",
	ulSerialNumber: "uint32",

	usFWMajor: "uint16",
	usFWMinor: "uint16",
	usFWBuild: "uint16",
	usFWRevision: "uint16",
	bFWNameLength: "uint8",
	abFWName: "char[63]",
	usFWYear: "uint16",
	bFWMonth: "uint8",
	bFWDay: "uint8",

	ulChannelError: "uint32",
	ulOpenCnt: "uint32",
	ulPutPacketCnt: "uint32",
	ulGetPacketCnt: "uint32",
	ulMailboxSize: "uint32",
	ulIOInAreaCnt: "uint32",
	ulIOOutAreaCnt: "uint32",
	ulHskSize: "uint32",
	ulNetxFlags: "uint32",
	ulHostFlags: "uint32",
	ulHostCOSFlags: "uint32",
	ulDeviceCOSFlags: "uint32",
});
export type CHANNEL_INFORMATION = {
	abBoardName: string,
	abBoardAlias: string,
	ulDeviceNumber: number,
	ulSerialNumber: number,

	usFWMajor: number,
	usFWMinor: number,
	usFWBuild: number,
	usFWRevision: number,
	bFWNameLength: number,
	abFWName: string,
	usFWYear: number,
	bFWMonth: number,
	bFWDay: number,

	ulChannelError: number,
	ulOpenCnt: number,
	ulPutPacketCnt: number,
	ulGetPacketCnt: number,
	ulMailboxSize: number,
	ulIOInAreaCnt: number,
	ulIOOutAreaCnt: number,
	ulHskSize: number,
	ulNetxFlags: number,
	ulHostFlags: number,
	ulHostCOSFlags: number,
	ulDeviceCOSFlags: number,
};

function loadFunctions(): CifX {
	let functions: CifX = {
		openDriver: CIFX_LIB.func("xDriverOpen", "int32", [koffi.out(koffi.pointer(CIFXHANDLE))]),
		closeDriver: CIFX_LIB.func("xDriverClose", "int32", [CIFXHANDLE]),
		getInfo: CIFX_LIB.func("xDriverGetInformation", "int32", [CIFXHANDLE, "uint32", koffi.out(koffi.pointer(DRIVER_INFORMATION))]),
		getBoard: CIFX_LIB.func("xDriverEnumBoards", "int32", [CIFXHANDLE, "uint32", "uint32", koffi.out(koffi.pointer(BOARD_INFORMATION))]),
		getChannel: CIFX_LIB.func("xDriverEnumChannels", "int32", [CIFXHANDLE, "uint32", "uint32", "uint32", koffi.out(koffi.pointer(CHANNEL_INFORMATION))]),
		openChannel: CIFX_LIB.func("xChannelOpen", "int32", [CIFXHANDLE, "char*", "uint32", koffi.out(koffi.pointer(CIFXHANDLE))]),
		closeChannel: CIFX_LIB.func("xChannelClose", "int32", [CIFXHANDLE]),
		ioWrite: CIFX_LIB.func("xChannelIOWrite", "int32", [CIFXHANDLE, "uint32", "uint32", "uint32", "uint8*", "uint32"]),
		ioRead: CIFX_LIB.func("xChannelIORead", "int32", [CIFXHANDLE, "uint32", "uint32", "uint32", koffi.out("uint8*"), "uint32"]),
		updateHostState: CIFX_LIB.func("xChannelHostState", "int32", [CIFXHANDLE, "uint32", koffi.out(koffi.pointer("uint32")), "uint32"]),
		updateBusState: CIFX_LIB.func("xChannelBusState", "int32", [CIFXHANDLE, "uint32", koffi.out(koffi.pointer("uint32")), "uint32"]),
		resetChannel: CIFX_LIB.func("xChannelReset", "int32", [CIFXHANDLE, "uint32", "uint32"]),
		lockConfig: CIFX_LIB.func("xChannelConfigLock", "int32", [CIFXHANDLE, "uint32", koffi.out(koffi.pointer("uint32")), "uint32"])
	};

	if (CURRENT_PLATFORM === "linux") {
		functions.init = CIFX_LIB.func("cifXDriverInit", "int32", []);
		functions.deinit = CIFX_LIB.func("cifXDriverDeinit", "int32", []);
		functions.getVersion = CIFX_LIB.func("cifXGetDriverVersion", "int32", ["int32", "const char*"]);
	}

	return functions;
}

export default loadFunctions();