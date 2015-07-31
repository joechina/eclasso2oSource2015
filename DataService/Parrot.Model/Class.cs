using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Parrot.Model
{
    public class Class
    {
        [Key]
        [DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string ClassNumber { get; set; }
        public string Description { get; set; }
        
        public string AccessCode { get; set; }

        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public virtual List<UserClass> Users { get; set; }
        public int TeacherId { get; set; }
        public bool autoApproved { get; set; }
    }
}
