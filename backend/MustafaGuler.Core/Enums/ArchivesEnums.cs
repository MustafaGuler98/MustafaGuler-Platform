namespace MustafaGuler.Core.Enums
{
    public enum WatchStatus
    {
        Watching = 1,
        Completed = 2,
        OnHold = 3,
        Dropped = 4,
        PlanToWatch = 5
    }

    public enum ReadingStatus
    {
        Reading = 1,
        Finished = 2,
        OnHold = 3,
        Dropped = 4,
        PlanToRead = 5
    }

    public enum GameStatus
    {
        Playing = 1,
        Finished = 2,
        Completed100 = 3,
        Dropped = 4,
        Backlog = 5
    }

    public enum TTRPGRole
    {
        Player = 1,
        GameMaster = 2
    }

    public enum CampaignStatus
    {
        Active = 1,
        Completed = 2,
        OnHiatus = 3,
        Abandoned = 4
    }
}
