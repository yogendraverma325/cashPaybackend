import DeviceDetector from "device-detector-js";

const detectDevice = async (req, res, next) => {
    const deviceDetector = new DeviceDetector();
    const result = deviceDetector.parse(req.headers['user-agent'])
    req.deviceSource = result;
    next()
}

export default detectDevice
