<?php

namespace Aurora\Modules\OAuthIntegratorWebclient\Models;

use Aurora\System\Classes\Model;
use Aurora\Modules\Core\Models\User;

class OauthAccount extends Model
{

	protected $foreignModel = User::class;
	protected $foreignModelIdColumn = 'IdUser'; // Column that refers to an external table

    protected $fillable = [
		'Id',
		'IdUser',
		'IdSocial',
		'Type',
		'Name',
		'Email',
		'AccessToken',
		'RefreshToken',
		'Scopes',
		'Disabled',
		'AccountType'
    ];

	public function getScopesAsArray()
	{
		$aResult = array();
		if (!$this->Disabled)
		{
			$aResult = array_map(function($sValue) {
					if (!empty($sValue))
					{
						return strtolower($sValue);
					}
				}, explode(' ', $this->Scopes)
			);
		}

		return $aResult;
	}

	/**
	 * @param string $sScope
	 *
	 * @return bool
	 */
	public function issetScope($sScope)
	{
		return /*'' === $this->Scopes || */false !== strpos(strtolower($this->Scopes), strtolower($sScope));
	}

	/**
	 * @param string $sScope
	 */
	public function setScope($sScope)
	{
		$aScopes = $this->getScopesAsArray();
		if (!array_search($sScope, array_unique($aScopes)))
		{
			$aScopes[] = $sScope;
			$this->Scopes = implode(' ', array_unique($aScopes));
		}
	}

	/**
	 * @param array $aScopes
	 */
	public function setScopes($aScopes)
	{
		$this->Scopes = implode(' ', array_unique(array_merge($aScopes, $this->getScopesAsArray())));
	}

	/**
	 * @param string $sScope
	 */
	public function unsetScope($sScope)
	{
		$aScopes = array_map(function($sValue) {
				return strtolower($sValue);
			}, explode(' ', $this->Scopes)
		);
		$mResult = array_search($sScope, $aScopes);
		if ($mResult !== false)
		{
			unset($aScopes[$mResult]);
			$this->Scopes = implode(' ', $aScopes);
		}
	}
}