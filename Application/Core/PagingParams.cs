using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class PagingParams
    {
        private const  int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int _pageSize = 3;
        public int PageSize
        {
            get => _pageSize; // this returns a default value. its the same as: get { return _pageSize; }
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
    }
}