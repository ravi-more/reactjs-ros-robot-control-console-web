const Config = {
    ROSBRIDGE_SERVER_IP: "127.0.0.1",
    ROSBRIDGE_SERVER_PORT: "9090",
    CMD_VEL_TOPIC: "/cmd_vel",
    GOAL_TOPIC: "/move_base_simple/goal",
    VIDEO_STREAM_URL: "http://0.0.0.0:8080/stream?topic=/camera/rgb/image_raw&type=mjpeg&width=300&height=200"
};

export default Config;