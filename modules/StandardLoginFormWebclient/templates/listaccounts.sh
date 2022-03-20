#!/bin/sh
cd /etc/virtual
for i in `cat domains | grep kugeza.com`; do
{
   if [ ! -s $i/passwd ]; then
       continue
   fi

   for u in `cat $i/passwd | cut -d: -f1`; do
   {
       echo "$u"
   };
   done

};
done
exit 0
