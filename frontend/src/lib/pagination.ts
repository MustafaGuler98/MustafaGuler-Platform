

/**

  @param items
  @param pageParam
  @param itemsPerPage
 */
export function paginateData<T>(
  items: T[] | null | undefined, 
  pageParam: string | string[] | undefined, 
  itemsPerPage: number = 9
) {
  const safeItems = items || [];
  const currentPage = Number(pageParam) || 1;
  const totalItems = safeItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const validPage = Math.max(1, Math.min(currentPage, totalPages > 0 ? totalPages : 1));

  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  const currentData = safeItems.slice(startIndex, endIndex);

  return {
    currentData,
    meta: {
      currentPage: validPage,
      totalPages,
      totalItems,
      hasNextPage: validPage < totalPages,
      hasPrevPage: validPage > 1
    }
  };
}