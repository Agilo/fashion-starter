import { Metadata } from "next"
import { redirect } from "next/navigation"

import { getCustomer } from "@lib/data/customer"
import { LocalizedLink } from "@/components/LocalizedLink"
import { ButtonLink } from "@/components/Button"
import {
  ReturnStatusTracker,
  ReturnStatus,
} from "@modules/returns/components/ReturnStatusTracker"
import { convertToLocale } from "@lib/util/money"

export const metadata: Metadata = {
  title: "Account - Returns",
  description: "View all your return requests",
}

// Mock function to get returns data
// In a real app, this would fetch from the API
async function getReturns() {
  // Mock data for demo
  return [
    {
      id: "ret_01h4ghqt9j7z8xr2n3k5m6v7w8",
      orderDisplayId: 1234,
      status: "shipped" as ReturnStatus,
      createdAt: "2026-01-28T10:00:00Z",
      totalRefund: 5900,
      currencyCode: "eur",
      itemsCount: 2,
      thumbnail: null,
    },
    {
      id: "ret_02h4ghqt9j7z8xr2n3k5m6v7w9",
      orderDisplayId: 1180,
      status: "refunded" as ReturnStatus,
      createdAt: "2026-01-15T10:00:00Z",
      totalRefund: 12900,
      currencyCode: "eur",
      itemsCount: 1,
      thumbnail: null,
    },
  ]
}

export default async function AccountReturnsPage() {
  const customer = await getCustomer().catch(() => null)

  if (!customer) {
    redirect("/")
  }

  const returns = await getReturns()

  return (
    <>
      <h1 className="text-md md:text-lg mb-8 md:mb-13">My returns</h1>

      {returns.length > 0 ? (
        <div className="flex flex-col gap-4">
          {returns.map((returnItem) => (
            <div
              key={returnItem.id}
              className="rounded-xs border border-grayscale-200 p-4"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap max-sm:flex-col md:max-lg:flex-col justify-between gap-4">
                  <div>
                    <LocalizedLink
                      href={`/account/returns/${returnItem.id}`}
                      className="text-md"
                    >
                      <span className="font-semibold">Return:</span> #
                      {returnItem.id.slice(-8).toUpperCase()}
                    </LocalizedLink>
                    <p className="text-grayscale-500 mt-2">
                      Order #{returnItem.orderDisplayId}
                    </p>
                  </div>
                  <div className="sm:max-md:text-right lg:text-right">
                    <p className="font-medium">
                      {convertToLocale({
                        currency_code: returnItem.currencyCode,
                        amount: returnItem.totalRefund,
                      })}
                    </p>
                    <p className="text-xs text-grayscale-500">
                      {returnItem.itemsCount} item
                      {returnItem.itemsCount > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap max-sm:flex-col md:max-lg:flex-col gap-4 sm:max-md:items-end lg:items-end">
                  <div className="overflow-x-auto flex-1">
                    <ReturnStatusTracker status={returnItem.status} />
                  </div>
                  <ButtonLink
                    href={`/account/returns/${returnItem.id}`}
                    variant="outline"
                    size="sm"
                    className="w-fit"
                  >
                    View Details
                  </ButtonLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-md mt-16">You don&apos;t have any returns yet</p>
      )}
    </>
  )
}
