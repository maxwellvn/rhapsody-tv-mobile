export const DEFAULT_PROFILE_AVATAR = require("@/assets/Icons/profile-icon.png");

export type AvatarGender = "male" | "female";
export const AVATAR_GENDERS: AvatarGender[] = ["male", "female"];

export const AVATAR_ICON_POOL: Record<AvatarGender, readonly string[]> = {
  male: [
    "account",
    "account-outline",
    "account-circle",
    "face-man",
    "face-man-profile",
    "account-tie",
  ],
  female: [
    "account",
    "account-outline",
    "account-circle",
    "face-woman",
    "face-woman-profile",
    "account-heart",
  ],
} as const;

const hashString = (value: string): number => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const normalizeGender = (
  gender?: string | null,
): AvatarGender | undefined => {
  if (!gender) return undefined;
  const value = gender.trim().toLowerCase();
  if (value === "male" || value === "m") return "male";
  if (value === "female" || value === "f") return "female";
  return undefined;
};

export const pickAvatarGender = (
  seed: string,
  preferredGender?: string | null,
): AvatarGender => {
  const normalized = normalizeGender(preferredGender);
  if (normalized) return normalized;
  return hashString(seed || "guest-user") % 2 === 0 ? "male" : "female";
};

export const pickAvatarIndex = (
  seed: string,
  gender: AvatarGender,
): number => {
  const poolSize = AVATAR_ICON_POOL[gender].length;
  return hashString(seed || "guest-user") % poolSize;
};

export const buildAvatarKey = (
  gender: AvatarGender,
  index: number,
) => {
  return `${gender}:${Math.abs(index)}`;
};

export const parseAvatarKey = (
  avatarKey?: string | null,
): { gender: AvatarGender; index: number } | null => {
  if (!avatarKey) return null;
  const [genderRaw, indexRaw] = avatarKey.split(":");
  const gender = normalizeGender(genderRaw);
  const index = Number(indexRaw);
  if (!gender || !Number.isFinite(index) || index < 0) return null;
  return { gender, index: Math.floor(index) };
};

type ResolveAvatarIdentityParams = {
  avatarKey?: string | null;
  gender?: string | null;
  seed?: string | null;
};

export const resolveAvatarIdentity = ({
  avatarKey,
  gender,
  seed,
}: ResolveAvatarIdentityParams) => {
  const parsed = parseAvatarKey(avatarKey);
  if (parsed) {
    const pool = AVATAR_ICON_POOL[parsed.gender];
    const normalizedIndex = parsed.index % pool.length;
    return {
      gender: parsed.gender,
      index: normalizedIndex,
      iconName: pool[normalizedIndex],
      avatarKey: buildAvatarKey(parsed.gender, normalizedIndex),
    };
  }

  const safeSeed = seed && seed.trim().length > 0 ? seed : "guest-user";
  const resolvedGender = pickAvatarGender(safeSeed, gender);
  const resolvedIndex = pickAvatarIndex(safeSeed, resolvedGender);
  return {
    gender: resolvedGender,
    index: resolvedIndex,
    iconName: AVATAR_ICON_POOL[resolvedGender][resolvedIndex],
    avatarKey: buildAvatarKey(resolvedGender, resolvedIndex),
  };
};
