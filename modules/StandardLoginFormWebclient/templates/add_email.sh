#!/bin/sh

#script to add an email account to DirectAdmin via command line.

MYUID=`/usr/bin/id -u`

#if [ "$MYUID" != 0 ]; then
#	echo "You require Root Access to run this script";
#	exit 1;
#fi

#if [ "$#" -lt 4 ]; then
#	echo "Usage:";
#	echo "   $0 <user> <domain> '<cryptedpass>' <plaintext> <quota>";
#	echo "";
#	echo "Variables <user> <domain> '<cryptedpass>' and <plaintext> are MANDATORY.";
#	echo "If plaintext is set to 1, then it can be a raw password";
#	echo "Else, set plaintext to 0 to use the provided crypted pass."
#	echo "quota, in bytes. Use 0 for unlimited (default is 0)";
#	echo "";
#	echo "The domain must already exist under a DA account";
#	exit 2;
#fi
#*/
EMAIL=$1
DOMAIN=kugeza.com
PASS=$3
PLAIN=$4
if [ ! -z "$5" ]; then
	QUOTAVAL=$5
else
	QUOTAVAL=0
fi

DAUSER=admin
DAUSER=`sudo grep "^${DOMAIN}:" /etc/virtual/domainowners | awk '{print $2;}'`
UHOME=`sudo grep "^${DAUSER}:" /etc/passwd | cut -d: -f6`

#DOMAINCONF= `sudo /usr/local/directadmin/data/users/${DAUSER}/domains/${DOMAIN}.conf`
#if [ ! -e ${DOMAINCONF} ]; then
#	echo "Cannot find ${DOMAINCONF}";
#	echo "Make sure the domain exists and is set in the /etc/virtual/domainowners file";
#	exit 3;
#fi

PASSWD=/etc/virtual/${DOMAIN}/passwd
QUOTA=/etc/virtual/${DOMAIN}/quota

#######################################################################################
#cd /etc/virtual
<<comment
for i in `cat /etc/virtual/domains | grep kugeza.com`; do
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
comment

#######################################################################################
if [ ! -e ${PASSWD} ]; then
	echo "Cannot find ${PASSWD}. Make sure the domain exists";
	exit 4;
fi

DOVECOT=`sudo /usr/local/directadmin/directadmin c | grep ^dovecot= | cut -d= -f2`
if [ "${DOVECOT}" != 0 ]; then
	DOVECOT=1;
fi

COUNT=`sudo grep -c "^${EMAIL}:" ${PASSWD}`
if [ "${COUNT}" = 0 ]; then
	PASSVALUE=$PASS
	if [ ${PLAIN} = 1 ]; then
		#encode the password.
		PASSVALUE=`echo "$PASS" | /usr/bin/openssl passwd -6 -stdin`
	fi

	if [ "${DOVECOT}" = 1 ]; then
		UUID=`id -u ${DAUSER}`
		MGID=`id -g mail`
		if sudo /usr/local/directadmin/directadmin c | grep -m1 -q '^add_userdb_quota=1$'; then
			APPEND=":userdb_quota_rule=*:bytes=${QUOTAVAL}"
		else
			APPEND=""
		fi
		 echo "${EMAIL}:${PASSVALUE}:${UUID}:${MGID}::${UHOME}/imap/${DOMAIN}/${EMAIL}:/bin/false${APPEND}" | sudo tee -a ${PASSWD}> /dev/null
	else
		echo "${EMAIL}:${PASSVALUE}" >> ${PASSWD}
	fi
	
	echo "Added ${EMAIL} to ${PASSWD}";
else
	echo "${EMAIL} already exists in ${PASSWD}. Not adding it to passwd.";
fi

#quota
if [ -e ${QUOTA} ]; then
	COUNT=`sudo grep -c "^${EMAIL}:" ${QUOTA}`
	if [ "${COUNT}" = 0 ]; then
		echo "${EMAIL}:${QUOTAVAL}" | sudo tee -a ${QUOTA} > /dev/null
	fi
else
    	echo "${EMAIL}:${QUOTAVAL}" > ${QUOTA}
fi

#ensure path exists for it.
if [ "${DOVECOT}" = 1 ]; then
	USERDIR=${UHOME}/imap/${DOMAIN}/${EMAIL}
	
	sudo mkdir --mode=770 -p $USERDIR/Maildir/new
	sudo mkdir --mode=770 -p $USERDIR/Maildir/cur
	
	sudo chown -R ${DAUSER}:mail ${USERDIR}
	sudo chmod 770 ${USERDIR} ${USERDIR}/Maildir
fi

exit 0;
