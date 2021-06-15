using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Server.DBModels
{
    public class GPIOList
    {
        public int ID { get; set; }
        public int GPIOId { get; set; }
        public GPIO GPIO { get; set; }
        public User User { get; set; }
    }
}
