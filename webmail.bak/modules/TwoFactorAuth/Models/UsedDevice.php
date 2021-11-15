<?php
/**
 * This code is licensed under AGPLv3 license or Afterlogic Software License
 * if commercial version of the product was purchased.
 * For full statements of the licenses see LICENSE-AFTERLOGIC and LICENSE-AGPL3 files.
 */

namespace Aurora\Modules\TwoFactorAuth\Models;

use Aurora\System\Classes\Model;
use Aurora\Modules\Core\Models\User;

/**
 * @license https://www.gnu.org/licenses/agpl-3.0.html AGPL-3.0
 * @license https://afterlogic.com/products/common-licensing Afterlogic Software License
 * @copyright Copyright (c) 2020, Afterlogic Corp.
 *
 * @package Api
 */
class UsedDevice extends Model
{
	protected $table = 'security_used_devices';
	protected $foreignModel = User::class;
	protected $foreignModelIdColumn = 'UserId'; // Column that refers to an external table


	protected $fillable = [
		'Id',
        'UserId',
        'DeviceId',
        'DeviceName',
        'AuthToken',
        'CreationDateTime',
        'LastUsageDateTime',
        'TrustTillDateTime',
        'DeviceIP'
	];

	public function toResponseArray()
	{
		$aResponse = parent::toResponseArray();
		$aResponse['Authenticated'] = false;
		if (\Aurora\Api::GetSettings()->GetValue('StoreAuthTokenInDB', false) && !empty($aResponse['AuthToken']) && !empty(\Aurora\System\Api::UserSession()->Get($aResponse['AuthToken'])))
		{
			$aResponse['Authenticated'] = true;
		}
		unset($aResponse['AuthToken']);
		return $aResponse;
	}
}
