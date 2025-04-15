using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Runtime.Session;
using Castle.Core.Logging;
using ezinvmvc.Web.Models.NotifHub;
using Microsoft.AspNetCore.SignalR;

namespace ezinvmvc.Web.Hub
{
    public class MyNotifHub : Microsoft.AspNetCore.SignalR.Hub, ITransientDependency
    {
        #region Data Members

        static List<UserDetail> ConnectedUsers = new List<UserDetail>();

        #endregion

        public IAbpSession AbpSession { get; set; }

        public ILogger Logger { get; set; }

        public MyNotifHub()
        {
            AbpSession = NullAbpSession.Instance;
            Logger = NullLogger.Instance;
        }

        public async Task SendNotification(string trCode, string trId, string receiverid, string senderid, string SenderName, string message)
        {
            await Clients.All.SendAsync("getNotification", trCode, trId, receiverid, senderid, SenderName, message);
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            Logger.Debug("A client connected to MyChatHub: " + Context.ConnectionId);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
            Logger.Debug("A client disconnected from MyChatHub: " + Context.ConnectionId);
        }
    }
}
