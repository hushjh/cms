using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace col.ajax
{
    public class pic
    {
        public int picId { get; set; }
        public string comId { get; set; }
        public string picName { get; set; }
        public string url { get; set; }
        public string createAt { get; set; }

    }
    /// <summary>
    /// comM 的摘要说明
    /// </summary>
    public class picM : IHttpHandler
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
                    strReturn = GetPicList();
                    break;
                case "add":
                    strReturn = AddPic();
                    break;
                case "edit":
                    strReturn = EditPic();
                    break;
                case "del":
                    strReturn = DelPic();
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
        public string DelPic()
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
                        int picId = Convert.ToInt32(suserid);
                        string strSql = string.Format("delete pic where picId={0}", picId);
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
                    string strSql = string.Format("delete pic where picId={0}", deluserids);
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
        public string EditPic()
        {
            try
            {
                string comId = context.Request.Form["comId"].ToString();
                string picName = context.Request.Form["picName"].ToString();
                string url = context.Request.Form["url"].ToString();
                string createAt = context.Request.Form["createAt"].ToString();
                int edituserid = Convert.ToInt32(context.Request.QueryString["edituserid"].ToString());//获取到更新的userid
                string strSql = string.Format("update pic set comId='{0}',picName='{1}',url='{2}',comment='{3}',createAt='{4}' where picId={5}", comId, picName, url, createAt, edituserid);
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
        public string AddPic()
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

        public string GetPicList()
        {
            string strWhere = context.Request.Form["strWhere"].ToString();
            int pageindex = Convert.ToInt32(context.Request.Form["page"].ToString());
            int pagesize = Convert.ToInt32(context.Request.Form["rows"].ToString());
            string strCount = "select count(*) from pic where " + strWhere;
            int count = Convert.ToInt32(SqlHelper.ExecuteScalarText(strCount).ToString());
            string str = string.Format(@"SELECT TOP {0} * 
FROM 
        (
        SELECT ROW_NUMBER() OVER (ORDER BY picId desc) AS RowNumber,* FROM pic where {2}
        ) A
WHERE RowNumber > {0}*({1}-1)", pagesize, pageindex, strWhere);
            DataTable dt = SqlHelper.ExecuteDataSetText(str, null).Tables[0];
            d.Add("total", count);
            List<pic> list = new List<pic>();
            if (dt.Rows.Count > 0)
            {
                for (int i = 0; i < dt.Rows.Count; i++)
                {
                    pic pic = new pic();
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