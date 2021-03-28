using Newtonsoft.Json;
using Server.DBModels;
using Server.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Server
{
    public static class FileManager
    {
        public static string GPIOFilePath = @"GPIOData.json";


        public static void SaveToJson(List<GPIO> data)
        {
            string content=JsonConvert.SerializeObject(data, Formatting.Indented);
            File.WriteAllText(GPIOFilePath, content);

        }
        public static List<GPIO> ReadFile()
        {
            string content = File.ReadAllText(GPIOFilePath);
            List<GPIO> actualGPIO = JsonConvert.DeserializeObject<List<GPIO>>(content);
            actualGPIO.Sort((x ,y)=>x.GPIONumber.CompareTo(y.GPIONumber));
            return actualGPIO;

        }

    }
}
