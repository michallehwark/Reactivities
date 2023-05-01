using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class HttpExtension
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages) 
        {
            var paginationHeader = new // we dont specify a type here we just create an object
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };
            response.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader));
            // this gives a key of "Pagination" as a header and later translates it to JsonString
            // because this is a custom header we need to expose it so our browser can read it
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}