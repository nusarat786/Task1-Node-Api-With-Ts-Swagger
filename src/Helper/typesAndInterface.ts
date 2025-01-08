interface JwtPayload {
    adminId: string;
    name: string;
  }

interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export {JwtPayload,AuthenticatedRequest}