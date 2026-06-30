## Why

The current default sorting for the gift list may not provide the most optimal experience for guests browsing available items. By prioritizing available gifts and pushing reserved/bought items to the end, we increase the visibility of items that can still be gifted. Additionally, a secondary sorting by price (highest to lowest) among available items can help present higher-value gifts more prominently.

## What Changes

- Change the default gift list sorting algorithm.
- Primary sorting criteria: Availability. Available items appear first; reserved or purchased items are moved to the end of the list.
- Secondary sorting criteria: Price. Among items with the same availability status (e.g., all available items), they will be sorted from highest price to lowest price.
- Create a new branch as the first implementation task for this feature.

## Capabilities

### New Capabilities
- `gift-list-sorting`: Defines the sorting behavior for the gift list, prioritizing availability and then price descending.

### Modified Capabilities
- (None)

## Impact

- Frontend components that fetch and display the gift list will receive a reordered list (or they will apply the new sorting logic client-side).
- If sorting is done on the backend, the API queries and database sorts will be updated to reflect the new criteria.
- No breaking changes are anticipated as it's an adjustment to the default sort order, which doesn't alter the data schema or remove existing data fields.
