using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace col.ajax
{
    /// <summary>
    /// comDetailPic 的摘要说明
    /// </summary>
    public class compic
    {
        public int picId { get; set; }
        public string comId { get; set; }
        public string picName { get; set; }
        public string url { get; set; }

        public string createAt { get; set; }

    }
    public class comDetailPic : IHttpHandler
    {
        HttpContext context;
        string strReturn = "";
        JavaScriptSerializer jss = new JavaScriptSerializer();
        Dictionary<string, object> d = new Dictionary<string, object>();
        public void ProcessRequest(HttpContext context)
        {
            //context.Response.ContentType = "text/plain";
            //context.Response.Write("Hello World");
            this.context = context;
            strReturn = GetPicList();
            context.Response.Write(strReturn);
        }

        public string GetPicList()
        {
            string comId = context.Request["comId"].ToString();
            string str = string.Format(@"SELECT * FROM pic where comId='{0}'", comId);
            DataTable dt = SqlHelper.ExecuteDataSetText(str, null).Tables[0];
            //d.Add("total", count);
            List<compic> list = new List<compic>();
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    compic pic = new compic();
                    pic.picId = Convert.ToInt32(dt.Rows[i]["picId"].ToString());
                    pic.comId = dt.Rows[i]["comId"].ToString();
                    pic.picName = dt.Rows[i]["picName"].ToString();
                    pic.url = dt.Rows[i]["url"].ToString();
                    pic.createAt = dt.Rows[i]["createAt"].ToString();
                    list.Add(pic);
                }
            }
            d.Add("rows", list);
            return jss.Serialize(d);
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}