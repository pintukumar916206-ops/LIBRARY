import { jest } from "@jest/globals";


jest.unstable_mockModule("cloudinary", () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn().mockResolvedValue({
        public_id: "mock_public_id",
        secure_url: "https:,
      }),
      destroy: jest.fn().mockResolvedValue({ result: "ok" }),
    },
  },
}));


jest.unstable_mockModule("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue({ messageId: "mock_id" }),
  }),
}));


jest.unstable_mockModule("../utils/logger.js", () => ({
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));


export const mockRequest = (body = {}, params = {}, query = {}, user = {}, cookies = {}, files = {}) => ({
  body,
  params,
  query,
  user,
  cookies,
  files,
});

export const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.cookie = jest.fn().mockReturnValue(res);
  return res;
};

export const mockNext = () => jest.fn();
