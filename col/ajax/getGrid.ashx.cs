using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace col.ajax
{
    /// <summary>
    /// getGrid 的摘要说明
   
    /// </summary>
    public class gd{
        public string createDate { get; set; }
        public string phoneNo { get; set; }
        public string cardNo { get; set; }
        public string remark { get; set; }
        public int del { get; set; }
        public int kid { get; set; }
    }
    public class getGrid : IHttpHandler
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
            Object obj = context.Request.Params;
            strReturn = GetAll();
            context.Response.Write(strReturn);
        }
        public string GetAll()
        {
            
            string str = "SELECT  * FROM grid";
            DataTable dt = SqlHelper.ExecuteDataSetText(str, null).Tables[0];
            List<gd> list = new List<gd>();
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    gd gdd = new gd();
                    gdd.kid = Convert.ToInt32(dt.Rows[i]["kid"].ToString());
                    gdd.del = Convert.ToInt32(dt.Rows[i]["del"].ToString());
                    gdd.createDate = dt.Rows[i]["createdate"].ToString();
                    gdd.phoneNo = dt.Rows[i]["phoneno"].ToString();
                    gdd.cardNo = dt.Rows[i]["cardno"].ToString();
                    gdd.remark = dt.Rows[i]["remark"].ToString();
                    list.Add(gdd);
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