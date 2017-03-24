using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace col.ajax
{
    public class userpt
    {
        public int id { get; set; }
        public string userName { get; set; }
        public string timestamp { get; set; }
        public string lon { get; set; }
        public string lat { get; set; }
        public string addr { get; set; }

    }
    /// <summary>
    /// comM 的摘要说明
    /// </summary>
    public class userPosition : IHttpHandler
    {
        HttpContext context;
        string strReturn = "";
        JavaScriptSerializer jss = new JavaScriptSerializer();
        Dictionary<string, object> d = new Dictionary<string, object>();
        public void ProcessRequest(HttpContext context)
        {
            this.context = context;
            string cmd = context.Request.Params["cmd"].ToString();
            switch (cmd)
            {
                case "list":
                    strReturn = GetUserPtList();
                    break;
                case "add":
                    strReturn = AddUserPt();
                    break;
                case "edit":
                    strReturn = EditUserPt();
                    break;
                case "del":
                    strReturn = DelUserPt();
                    break;
                case "excel":
                    strReturn = GetExcelAddress();
                    break;
            }
            context.Response.Write(strReturn);
        }

        public string GetExcelAddress()
        {
            return "";
        }

        /// 删除用户
        /// </summary>
        /// <returns></returns>
        public string DelUserPt()
        {
            try
            {
                string deluserids = context.Request.Form["deluserids"].ToString();
                if (deluserids.IndexOf("_") > 0)
                {
                    bool b = true;
                    string[] aUserIds = deluserids.Split('_');
                    foreach (var suserid in aUserIds)
                    {
                        int id = Convert.ToInt32(suserid);
                        string strSql = string.Format("delete userPostition where id={0}", id);
                        int i = SqlHelper.ExecteNonQueryText(strSql, null);
                        if (i <= 0)
                        {
                            b = false;
                        }
                    }
                    if (b)
                    {
                        d.Add("success", true);
                    }
                    else
                    {
                        d.Add("success", false);
                        d.Add("infor", "删除失败");
                    }
                }
                else
                {
                    string strSql = string.Format("delete userPosition where id={0}", deluserids);
                    int i = SqlHelper.ExecteNonQueryText(strSql, null);
                    if (i > 0)
                    {
                        d.Add("success", true);
                    }
                    else
                    {
                        d.Add("success", false);
                        d.Add("infor", "删除失败");
                    }
                }
            }
            catch
            {
                d.Add("success", false);
                d.Add("infor", "删除失败");
            }
            return jss.Serialize(d);
        }

        /// 更新用户
        /// </summary>
        /// <returns></returns>
        public string EditUserPt()
        {
            try
            {

                string userName = context.Request.Form["userName"].ToString();
                string timestamp = context.Request.Form["timestamp"].ToString();
                string lon = context.Request.Form["lon"].ToString();
                string lat = context.Request.Form["lat"].ToString();
                string addr = context.Request.Form["addr"].ToString();
                int edituserid = Convert.ToInt32(context.Request.QueryString["edituserid"].ToString());//获取到更新的userid
                string strSql = string.Format("update userPosition set userName='{0}',timestamp='{1}',lon='{2}',lat='{3}',addr='{4}' where id={5}", userName, timestamp, lon, lat, addr, edituserid);
                int i = SqlHelper.ExecteNonQueryText(strSql, null);
                if (i > 0)
                {
                    d.Add("success", true);
                }
                else
                {
                    d.Add("success", false);
                    d.Add("infor", "更新失败");
                }
            }
            catch
            {
                d.Add("success", false);
                d.Add("infor", "更新失败");
            }
            return jss.Serialize(d);
        }
        /// <summary>
        /// 增加公司信息
        /// </summary>
        /// <returns></returns>
        public string AddUserPt()
        {
            try
            {
                string comId = context.Request.Form["comId"].ToString();
                string picName = context.Request.Form["picName"].ToString();
                string url = context.Request.Form["url"].ToString();
                string createAt = context.Request.Form["createAt"].ToString();
                string strSql = string.Format("insert into pic(comId,picName,url,createAt) values('{0}','{1}','{2}','{3}')", comId, picName, url, createAt);
                int i = SqlHelper.ExecteNonQueryText(strSql, null);
                if (i > 0)
                {
                    d.Add("success", true);
                }
                else
                {
                    d.Add("success", false);
                    d.Add("infor", "添加失败");
                }
            }
            catch
            {
                d.Add("success", false);
                d.Add("infor", "添加失败");
            }
            return jss.Serialize(d);
        }

        public string GetUserPtList()
        {
            string strWhere = context.Request.Form["strWhere"].ToString();
            int pageindex = Convert.ToInt32(context.Request.Form["page"].ToString());
            int pagesize = Convert.ToInt32(context.Request.Form["rows"].ToString());
            string strCount = "select count(*) from userPosition where " + strWhere;
            int count = Convert.ToInt32(SqlHelper.ExecuteScalarText(strCount).ToString());
            string str = string.Format(@"SELECT TOP {0} * 
FROM 
        (
        SELECT ROW_NUMBER() OVER (ORDER BY id desc) AS RowNumber,* FROM userPosition where {2}
        ) A
WHERE RowNumber > {0}*({1}-1)", pagesize, pageindex, strWhere);
            DataTable dt = SqlHelper.ExecuteDataSetText(str, null).Tables[0];
            d.Add("total", count);
            List<userpt> list = new List<userpt>();
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    userpt up = new userpt();
                    up.id = Convert.ToInt32(dt.Rows[i]["id"].ToString());
                    up.userName = dt.Rows[i]["userName"].ToString();
                    up.timestamp = dt.Rows[i]["timestamp"].ToString();
                    up.lon = dt.Rows[i]["lon"].ToString();
                    up.lat = dt.Rows[i]["lat"].ToString();
                    up.addr = dt.Rows[i]["addr"].ToString();
                    list.Add(up);
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