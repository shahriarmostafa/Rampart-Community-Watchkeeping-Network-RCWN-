export type BlockUpdate = {
  _id: string;
  blockCode: string;
  authorFirebaseUid: string;
  authorName?: string;
  authorRole: "truth_keeper" | "guardian";
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateBlockUpdatePayload = {
  blockCode: string;
  authorFirebaseUid: string;
  authorName?: string;
  authorRole: "truth_keeper" | "guardian";
  title: string;
  body: string;
};
