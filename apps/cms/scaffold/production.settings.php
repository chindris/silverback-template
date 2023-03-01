<?php
// Make sure to not have the stage file proxy active (since the CMS can be
// served from multiple domains.
$config['stage_file_proxy.settings']['origin'] = '';
