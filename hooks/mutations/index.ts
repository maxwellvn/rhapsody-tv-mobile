/**
 * Auth Mutations
 * Re-exports all authentication-related mutations from useAuthQueries
 */
export {
  useKingsChatLogin,
  useLogin,
  useLogout,
  useRegister,
  useRequestEmailVerification,
  useVerifyEmail
} from "../queries/useAuthQueries";

