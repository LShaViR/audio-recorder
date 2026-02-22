import useOnlineStatus from "@/hooks/useOnlineStatus";

const OnlineFlag = () => {
  const online = useOnlineStatus();
  return (
    <span style={{ color: online ? "#4caf50" : "#f44336" }}>
      ● {online ? "online" : "offline"}
    </span>
  );
};

export default OnlineFlag;
