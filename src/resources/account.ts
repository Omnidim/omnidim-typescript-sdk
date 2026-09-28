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
  /** The same balance converted into the organization's display currency. */
  display_amount: number;
  display_currency: string;
  display_currency_symbol: string;
  /** True when the balance has dropped below $0.50. */
  is_low: boolean;
  /**
   * Whether the balance currently allows calls. Branch on this rather than
   * comparing `amount` against zero: an organization on usage-based billing
   * can still place calls at a zero balance.
   *
   * Credit only. An account stopped for any other reason never reaches this
   * endpoint; every request returns 403.
   */
  can_place_calls: boolean;
}

/**
 * Minutes the balance buys at the rates in `rates_per_minute_usd`. An estimate
 * at today's rates, not a promise.
 *
 * `null` means the matching rate is not set, so no honest estimate exists. `0`
 * means the balance buys nothing, which is also the answer when it is negative.
 */
export interface AccountMinutesRemaining {
  basic_model: number | null;
  premium_model: number | null;
}

export interface AccountRates {
  basic_model: number;
  premium_model: number;
  /** Present only on a negotiated telephony rate; otherwise billed at the live carrier rate. */
  outbound_telephony?: number;
}

export interface AccountPlan {
  id: number | null;
  name: string | null;
  billing_interval: "Monthly" | "Yearly" | "One Time" | null;
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
  estimated_minutes_remaining: AccountMinutesRemaining;
  rates_per_minute_usd: AccountRates;
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
   * Branch on `balance.can_place_calls` rather than comparing
   * `balance.amount` against zero: an organization on usage-based billing
   * can still place calls at a zero balance.
   *
   * The API key's user needs Billing access in the organization.
   */
  balance() {
    return this.http.request<AccountBalance>("GET", "/account/balance");
  }
}
