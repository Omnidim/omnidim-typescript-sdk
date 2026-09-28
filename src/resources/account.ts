import type { HttpClient } from "../http.js";

/**
 * Types here are declared locally rather than pulled from
 * `src/generated/types.ts` via `ResultOf<"getAccountBalance">`, because the
 * generated file is regenerated from the PUBLISHED spec
 * (https://docs.omnidim.io/openapi.yaml) and this operation is not in it
 * until the docs deploy. Regenerating from the local spec to get one
 * operation would have dragged in every other change published since the
 * last regen. Same approach as `integrations.ts`.
 *
 * On the next `npm run regen` after the docs ship, these can collapse to
 * `ResultOf<"getAccountBalance">`; the shape below is the spec's
 * `AccountBalance` schema verbatim.
 */

export interface AccountBalanceAmount {
  /** Remaining balance in USD. Negative when the account is drawn past zero. */
  amount: number;
  /** Always `USD`. The balance and every platform rate are held in USD. */
  currency: string;
}

export interface AccountPlan {
  id: number | null;
  name: string | null;
  billing_interval: "Monthly" | "Yearly" | "One Time" | null;
  /**
   * When true, calls are metered to the payment method rather than drawn from
   * the wallet, so a zero or negative `balance.amount` does not stop them.
   */
  is_usage_based: boolean;
  subscription_status: string | null;
  /** ISO 8601 UTC. Set only while the subscription is active. */
  renews_at: string | null;
}

/** `shared_*` is populated only for organizations inside a reseller family. */
export interface AccountConcurrency {
  limit: number;
  in_use: number;
  available: number;
  shared_limit: number | null;
  shared_in_use: number | null;
}

export interface AccountAutoRecharge {
  enabled: boolean;
  threshold_usd: number;
  amount_usd: number;
}

export interface AccountBalance {
  success: boolean;
  organization: { id: number; name: string };
  balance: AccountBalanceAmount;
  /**
   * Minutes the balance buys at `rates_per_minute_usd`. An estimate at today's
   * rate, not a promise.
   *
   * `null` means no rate is set, so no honest estimate exists. `0` means the
   * balance buys nothing, which is also the answer when it is negative.
   */
  estimated_minutes_remaining: number | null;
  /** The voice rate per minute in USD. One rate, not a per-model set. */
  rates_per_minute_usd: number;
  /**
   * Present only on a negotiated telephony rate. Absent means telephony is
   * billed at the live carrier rate for the destination, which varies by
   * country and is not one number.
   */
  outbound_telephony_per_minute_usd?: number;
  plan: AccountPlan;
  concurrency: AccountConcurrency;
  auto_recharge: AccountAutoRecharge;
}

export class Account {
  constructor(private readonly http: HttpClient) {}

  /**
   * Read the wallet of the organization this API key belongs to: the
   * remaining balance, the minutes it buys, the active plan, concurrency
   * headroom, and auto-recharge settings.
   *
   * A balance at or below zero does not always mean calls will stop. Check
   * `plan.is_usage_based` first: such an organization keeps placing calls and
   * is metered to its payment method instead.
   *
   * The API key's user needs Billing access in the organization.
   */
  balance() {
    return this.http.request<AccountBalance>("GET", "/account/balance");
  }
}
