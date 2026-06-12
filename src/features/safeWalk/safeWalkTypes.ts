export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type SafeWalkSharePayload = {
  sessionId: string;
  coordinates: Coordinates;
};
