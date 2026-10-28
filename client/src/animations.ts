import { keyframes } from "@mui/material/styles";

export const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const bob = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-14px); }
`;

export const floaty = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, -30px) scale(1.12); }
`;

export const shimmer = keyframes`
  to { background-position: 220% center; }
`;

export const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.5); }
`;

export const pulseGlow = keyframes`
  0%, 100% { opacity: 0.75; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
`;

export const marquee = keyframes`
  to { transform: translateX(-50%); }
`;

export const scrollDot = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  80% { transform: translateY(16px); opacity: 0; }
  100% { opacity: 0; }
`;

export const ring = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(228, 32, 45, 0.6), 0 14px 30px -10px rgba(0, 0, 0, 0.7); }
  70%, 100% { box-shadow: 0 0 0 18px rgba(228, 32, 45, 0), 0 14px 30px -10px rgba(0, 0, 0, 0.7); }
`;

export const marqueeRev = keyframes`
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
`;
