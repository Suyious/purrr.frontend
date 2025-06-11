const iceServers = [
  {
    urls: "stun:stun.relay.metered.ca:80",
  },
  {
    urls: "turn:global.relay.metered.ca:80",
    username: "526476641fc039720d67fb84",
    credential: "kMq2wPeBjtQmeuEa",
  },
  {
    urls: "turn:global.relay.metered.ca:80?transport=tcp",
    username: "526476641fc039720d67fb84",
    credential: "kMq2wPeBjtQmeuEa",
  },
  {
    urls: "turn:global.relay.metered.ca:443",
    username: "526476641fc039720d67fb84",
    credential: "kMq2wPeBjtQmeuEa",
  },
  {
    urls: "turns:global.relay.metered.ca:443?transport=tcp",
    username: "526476641fc039720d67fb84",
    credential: "kMq2wPeBjtQmeuEa",
  },
]

export default iceServers;