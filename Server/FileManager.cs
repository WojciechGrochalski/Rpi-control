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
        public static string GPIOFilePath = @"Json/GPIOData.json";
        public static string GPIOFilePathAllGPIO = @"Json/AllPins.json";

        public static void SaveToJson(List<GPIO> data)
        {
            string content=JsonConvert.SerializeObject(data, Formatting.Indented);
            File.WriteAllText(GPIOFilePath, content);

        }
        public static List<GPIO> ReadFile()
        {
            string content = File.ReadAllText(GPIOFilePathAllGPIO);
            List<GPIO> actualGPIO = JsonConvert.DeserializeObject<List<GPIO>>(content);
            List<GPIO> leftGPIO = new List<GPIO>();
            List<GPIO> rightGPIO = new List<GPIO>();
            foreach (var item in actualGPIO)
            {
                if (item.GPIONumber % 2 == 0)
                {
                    rightGPIO.Add(item);
                }
                else
                {
                    leftGPIO.Add(item);
                }
            }
            leftGPIO.AddRange(rightGPIO);
            // actualGPIO.Sort((x ,y)=>x.GPIONumber.CompareTo(y.GPIONumber));
            return leftGPIO;

        }

    }
}
