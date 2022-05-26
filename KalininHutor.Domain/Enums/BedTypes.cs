using System.ComponentModel;

namespace KalininHutor.Domain.BillBoard.Enums
{
    ///<summary>Возможные вариантов кроватей в номере</summary>
    public enum BedTypes
    {
        [Description("Односпальная кровать")]
        ///<summary>Односпальная кровать</summary>
        Single,
        
        [Description("Большая односпальная кровать")]
        ///<summary>Большая односпальная кровать</summary>
        BigSingle,
        
        [Description("Двуспальная кровать")]
        ///<summary>Двуспальная кровать</summary>
        Double,
        
        [Description("Большая двуспальная кровать")]
        ///<summary>Большая двуспальная кровать</summary>
        BigDouble,
        
        [Description("Детская кровать")]
        ///<summary>Детская кровать</summary>
        BabyBed
    }
}