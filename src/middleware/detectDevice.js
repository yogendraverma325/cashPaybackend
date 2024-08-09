import DeviceDetector from "node-device-detector";

const detectDevice = async (req, res, next) => {
    const detector = new DeviceDetector();
    const userAgent = req.get("User-Agent");
    const result = detector.detect(userAgent);
    req.deviceSource = JSON.stringify(result);
    next()
}

export default detectDevice
