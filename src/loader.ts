import * as koffi from "koffi";

export const CURRENT_PLATFORM = process.platform;
export const CIFX_LIB = getLib();

function getLib() {
	if (CURRENT_PLATFORM === "win32") {
		return koffi.load("cifX32dll.dll");
	} else if (CURRENT_PLATFORM === "linux") {
		return koffi.load("/usr/local/lib/libcifx.so");
	} else {
		throw new Error("Unsupported platform for cifx library: " + CURRENT_PLATFORM);
	}
}